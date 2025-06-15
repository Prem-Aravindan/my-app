import ReplayKit
import CoreVideo
import CoreImage
import UIKit

class SampleHandler: RPBroadcastSampleHandler {
    
    private let ciContext = CIContext()
    private var frameCount = 0
    private let targetSize = CGSize(width: 224, height: 224)
    private let jpegQuality: CGFloat = 0.5
    
    override func broadcastStarted(withSetupInfo setupInfo: [String : NSObject]?) {
        // User has requested to start the broadcast.
        print("📱 Broadcast started with setup info: \(String(describing: setupInfo))")
        frameCount = 0
    }
    
    override func broadcastPaused() {
        // User has requested to pause the broadcast. Samples will stop being delivered.
        print("📱 Broadcast paused")
    }
    
    override func broadcastResumed() {
        // User has requested to resume the broadcast. Samples delivery will resume.
        print("📱 Broadcast resumed")
    }
    
    override func broadcastFinished() {
        // User has requested to finish the broadcast.
        print("📱 Broadcast finished")
    }
    
    override func processSampleBuffer(_ sampleBuffer: CMSampleBuffer, with sampleBufferType: RPSampleBufferType) {
        switch sampleBufferType {
        case RPSampleBufferType.video:
            processVideoSampleBuffer(sampleBuffer)
        case RPSampleBufferType.audioApp:
            // Handle app audio if needed
            break
        case RPSampleBufferType.audioMic:
            // Handle microphone audio if needed
            break
        @unknown default:
            // Handle unknown sample buffer types
            fatalError("Unknown sample buffer type")
        }
    }
    
    private func processVideoSampleBuffer(_ sampleBuffer: CMSampleBuffer) {
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
            print("❌ Failed to get pixel buffer from sample buffer")
            return
        }
        
        // Throttle to reduce processing load (process every 10th frame approximately)
        frameCount += 1
        if frameCount % 10 != 0 {
            return
        }
        
        // Convert CVPixelBuffer to CIImage
        let ciImage = CIImage(cvPixelBuffer: pixelBuffer)
        
        // Resize to target size
        let scaledImage = resizeImage(ciImage, to: targetSize)
        
        // Convert to JPEG data
        guard let jpegData = ciContext.jpegRepresentation(of: scaledImage, colorSpace: CGColorSpaceCreateDeviceRGB(), options: [kCGImageDestinationLossyCompressionQuality: jpegQuality]) else {
            print("❌ Failed to convert image to JPEG")
            return
        }
        
        // Convert to base64
        let base64String = jpegData.base64EncodedString()
        
        // Send frame data to React Native
        sendFrameToReactNative(base64: base64String, width: Int(targetSize.width), height: Int(targetSize.height))
    }
    
    private func resizeImage(_ image: CIImage, to size: CGSize) -> CIImage {
        let scale = min(size.width / image.extent.width, size.height / image.extent.height)
        let resizedImage = image.transformed(by: CGAffineTransform(scaleX: scale, y: scale))
        
        // Center the image in the target size
        let dx = (size.width - resizedImage.extent.width) / 2
        let dy = (size.height - resizedImage.extent.height) / 2
        
        return resizedImage.transformed(by: CGAffineTransform(translationX: dx, y: dy))
    }
    
    private func sendFrameToReactNative(base64: String, width: Int, height: Int) {
        // Create frame data dictionary
        let frameData: [String: Any] = [
            "base64": base64,
            "width": width,
            "height": height,
            "timestamp": Date().timeIntervalSince1970 * 1000
        ]
        
        // Send notification to React Native module
        // Note: In a real implementation, you would need to set up a proper communication channel
        // between the extension and the main app (e.g., using App Groups and NSUserDefaults,
        // or a custom communication protocol)
        
        NotificationCenter.default.post(
            name: NSNotification.Name("ScreenFrameCaptured"),
            object: nil,
            userInfo: frameData
        )
        
        // For debugging
        print("📸 Frame captured: \(width)x\(height), base64 length: \(base64.count)")
    }
}

// MARK: - Extension for better error handling
extension SampleHandler {
    
    override func finishBroadcastWithError(_ error: Error) {
        print("❌ Broadcast finished with error: \(error.localizedDescription)")
        super.finishBroadcastWithError(error)
    }
}
